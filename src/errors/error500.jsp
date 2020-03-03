<%-- 
    Document   : error404
    Created on : 12 Jul, 2017, 1:49:22 PM
    Author     : altius
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page isErrorPage = "true"%>
<%@ page import = "java.io.*" %>
<!DOCTYPE html>
<html lang="en">
    <head>        
        <%@include file="../WEB-INF/jsp/common/meta.jsp"%>
        <!-- END META SECTION -->
        <!-- CSS INCLUDE -->        
        <%@include file="../WEB-INF/jsp/common/css.jsp"%>
        <!-- EOF CSS INCLUDE -->                                                   
    </head>
    <body>
        <div class="error-container">
            <div class="error-code">500</div>
            <div class="error-text">Internal server error</div>
            <div class="error-subtext">An error occurred while processing this request</div>
            <div class="error-actions">                                
                <div class="row">
                    <table style="border:#9fb5cc 1px solid;margin-left: -170px">
                        <tr>
                            <td>
                                <div style="border: solid 1px #ccc; width: 870px; height: 200px; overflow: scroll; font: normal 14px verdana; color: #333;background-color: #fff; ">
                                    <%=(exception != null ? exception.toString() : "")%><br/><br/>
                                </div>
                            </td>
                        </tr>
                    </table><br>
                    <div class="col-md-12">
                        <div class="col-md-6">
                            <button class="btn btn-info btn-block btn-lg" onClick="document.location.href = '../home/login';">Back to login</button>
                        </div>
                        <div class="col-md-6">
                            <button class="btn btn-info btn-block btn-lg" onClick="document.location.href = '../home/home';">Back to home</button>
                        </div>
                    </div>
                </div>                                
            </div>
        </div>                 
    </body>
</html>
