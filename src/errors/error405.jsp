<%-- 
    Document   : error404
    Created on : 12 Jul, 2017, 1:49:22 PM
    Author     : altius
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
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
            <div class="error-code">405</div>
            <div class="error-text">Method not allowed</div>
            <div class="error-subtext">The page you are looking for cannot be displayed because an invalid method is being used.</div>
            <div class="error-actions">                                
                <div class="row">
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
